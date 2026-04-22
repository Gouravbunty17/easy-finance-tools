param(
  [string]$BaseUrl = "https://easyfinancetools.com",
  [switch]$Json
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Net.Http

function New-HttpClient {
  $handler = [System.Net.Http.HttpClientHandler]::new()

  try {
    $handler.AutomaticDecompression = (
      [System.Net.DecompressionMethods]::GZip `
      -bor [System.Net.DecompressionMethods]::Deflate `
      -bor [System.Net.DecompressionMethods]::Brotli
    )
  } catch {
    $handler.AutomaticDecompression = (
      [System.Net.DecompressionMethods]::GZip `
      -bor [System.Net.DecompressionMethods]::Deflate
    )
  }

  $client = [System.Net.Http.HttpClient]::new($handler)
  $client.Timeout = [TimeSpan]::FromSeconds(30)
  $client.DefaultRequestHeaders.UserAgent.ParseAdd("EasyFinanceToolsVerify/1.0")

  return $client
}

function Get-HttpResult {
  param(
    [System.Net.Http.HttpClient]$Client,
    [string]$Url,
    [ValidateSet("GET", "HEAD")] [string]$Method = "GET"
  )

  $request = [System.Net.Http.HttpRequestMessage]::new([System.Net.Http.HttpMethod]::$Method, $Url)

  try {
    $response = $Client.SendAsync($request).GetAwaiter().GetResult()
    $content = ""

    if ($Method -eq "GET") {
      $content = $response.Content.ReadAsStringAsync().GetAwaiter().GetResult()
    }

    $headers = @{}

    foreach ($header in $response.Headers.GetEnumerator()) {
      $headers[$header.Key.ToLowerInvariant()] = ($header.Value -join ", ")
    }

    foreach ($header in $response.Content.Headers.GetEnumerator()) {
      $headers[$header.Key.ToLowerInvariant()] = ($header.Value -join ", ")
    }

    return [pscustomobject]@{
      Url        = $response.RequestMessage.RequestUri.AbsoluteUri
      StatusCode = [int]$response.StatusCode
      Headers    = [pscustomobject]$headers
      Content    = $content
      Bytes      = [System.Text.Encoding]::UTF8.GetByteCount($content)
    }
  } finally {
    if ($null -ne $request) {
      $request.Dispose()
    }

    if ($null -ne $response) {
      $response.Dispose()
    }
  }
}

function Get-MatchCount {
  param(
    [string]$Text,
    [string]$Pattern
  )

  return ([regex]::Matches($Text, $Pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)).Count
}

function Get-FirstMatch {
  param(
    [string]$Text,
    [string]$Pattern
  )

  $match = [regex]::Match($Text, $Pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

  if ($match.Success) {
    return $match.Groups[1].Value
  }

  return ""
}

function Resolve-AssetUrl {
  param(
    [string]$Base,
    [string]$Path
  )

  if ([string]::IsNullOrWhiteSpace($Path)) {
    return ""
  }

  if ($Path.StartsWith("http://") -or $Path.StartsWith("https://")) {
    return $Path
  }

  return ("{0}{1}" -f $Base.TrimEnd("/"), $Path)
}

$checks = New-Object System.Collections.Generic.List[object]

function Add-Check {
  param(
    [string]$Name,
    [string]$Expected,
    [string]$Actual,
    [bool]$Passed
  )

  $checks.Add([pscustomobject]@{
      Check    = $Name
      Expected = $Expected
      Actual   = $Actual
      Status   = if ($Passed) { "PASS" } else { "FAIL" }
    })
}

$client = New-HttpClient

try {
  $base = $BaseUrl.TrimEnd("/")

  $homepageHead = Get-HttpResult -Client $client -Url "$base/" -Method HEAD
  $homepage = Get-HttpResult -Client $client -Url "$base/" -Method GET
  $tfsa = Get-HttpResult -Client $client -Url "$base/tools/tfsa-calculator" -Method GET
  $privacy = Get-HttpResult -Client $client -Url "$base/privacy-policy" -Method GET
  $terms = Get-HttpResult -Client $client -Url "$base/terms" -Method GET
  $contact = Get-HttpResult -Client $client -Url "$base/contact" -Method GET

  $homeTitle = Get-FirstMatch -Text $homepage.Content -Pattern "<title>(.*?)</title>"
  $tfsaTitle = Get-FirstMatch -Text $tfsa.Content -Pattern "<title>(.*?)</title>"
  $tfsaCanonical = Get-FirstMatch -Text $tfsa.Content -Pattern '<link rel="canonical" href="([^"]+)"'

  $adsCount = Get-MatchCount -Text $homepage.Content -Pattern "adsbygoogle"
  $fundingChoicesCount = Get-MatchCount -Text $homepage.Content -Pattern "fundingchoices"
  $gouravCount = Get-MatchCount -Text $tfsa.Content -Pattern "Gourav Kumar"
  $fontsGoogleCount = Get-MatchCount -Text $homepage.Content -Pattern "fonts\.googleapis\.com"

  $cssHref = Get-FirstMatch -Text $homepage.Content -Pattern 'href="([^"]*?/assets/[^"]+\.css)"'
  $cssResult = $null
  $hasNewSecondary = $false
  $hasOldSecondary = $false
  $secondaryActual = "CSS asset not found"

  if ($cssHref) {
    $cssUrl = Resolve-AssetUrl -Base $base -Path $cssHref
    $cssResult = Get-HttpResult -Client $client -Url $cssUrl -Method GET
    $hasNewSecondary = [regex]::IsMatch($cssResult.Content, '\.text-secondary\{[^}]{0,200}(#00557a|0 85 122)', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    $hasOldSecondary = [regex]::IsMatch($cssResult.Content, '\.text-secondary\{[^}]{0,200}(#00a8e8|0 168 232)', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

    if ($hasNewSecondary) {
      $secondaryActual = "#00557a"
    } elseif ($hasOldSecondary) {
      $secondaryActual = "#00a8e8"
    } else {
      $secondaryActual = "text-secondary present but color not matched"
    }
  }

  $ageHeader = ""
  if ($homepageHead.Headers.PSObject.Properties.Name -contains "age") {
    $ageHeader = [string]$homepageHead.Headers.age
  }

  $etagHeader = ""
  if ($homepageHead.Headers.PSObject.Properties.Name -contains "etag") {
    $etagHeader = [string]$homepageHead.Headers.etag
  }

  $lastModifiedHeader = ""
  if ($homepageHead.Headers.PSObject.Properties.Name -contains "last-modified") {
    $lastModifiedHeader = [string]$homepageHead.Headers.'last-modified'
  }

  Add-Check -Name "Homepage status" -Expected "200" -Actual ([string]$homepage.StatusCode) -Passed ($homepage.StatusCode -eq 200)
  Add-Check -Name "Homepage ETag present" -Expected "non-empty" -Actual $etagHeader -Passed (-not [string]::IsNullOrWhiteSpace($etagHeader))
  Add-Check -Name "Homepage Last-Modified present" -Expected "non-empty" -Actual $lastModifiedHeader -Passed (-not [string]::IsNullOrWhiteSpace($lastModifiedHeader))
  Add-Check -Name "Homepage Age header" -Expected "reported only" -Actual ($(if ($ageHeader) { $ageHeader } else { "missing" })) -Passed $true
  Add-Check -Name "Homepage title" -Expected "Free Canadian Finance Calculators | EasyFinanceTools" -Actual $homeTitle -Passed ($homeTitle -eq "Free Canadian Finance Calculators | EasyFinanceTools")
  Add-Check -Name "Homepage size" -Expected ">= 40000 bytes" -Actual ([string]$homepage.Bytes) -Passed ($homepage.Bytes -ge 40000)
  Add-Check -Name "AdSense removed from homepage" -Expected "0 matches" -Actual ([string]$adsCount) -Passed ($adsCount -eq 0)
  Add-Check -Name "Funding Choices removed from homepage" -Expected "0 matches" -Actual ([string]$fundingChoicesCount) -Passed ($fundingChoicesCount -eq 0)
  Add-Check -Name "TFSA page status" -Expected "200" -Actual ([string]$tfsa.StatusCode) -Passed ($tfsa.StatusCode -eq 200)
  Add-Check -Name "TFSA page title" -Expected "TFSA Calculator 2026 | EasyFinanceTools" -Actual $tfsaTitle -Passed ($tfsaTitle -eq "TFSA Calculator 2026 | EasyFinanceTools")
  Add-Check -Name "TFSA canonical" -Expected "$base/tools/tfsa-calculator" -Actual $tfsaCanonical -Passed ($tfsaCanonical -eq "$base/tools/tfsa-calculator")
  Add-Check -Name "TFSA byline" -Expected ">= 1 Gourav Kumar match" -Actual ([string]$gouravCount) -Passed ($gouravCount -ge 1)
  Add-Check -Name "Privacy Policy status" -Expected "200" -Actual ([string]$privacy.StatusCode) -Passed ($privacy.StatusCode -eq 200)
  Add-Check -Name "Privacy Policy size" -Expected ">= 25000 bytes" -Actual ([string]$privacy.Bytes) -Passed ($privacy.Bytes -ge 25000)
  Add-Check -Name "Terms status" -Expected "200" -Actual ([string]$terms.StatusCode) -Passed ($terms.StatusCode -eq 200)
  Add-Check -Name "Contact status" -Expected "200" -Actual ([string]$contact.StatusCode) -Passed ($contact.StatusCode -eq 200)
  Add-Check -Name "text-secondary color" -Expected "#00557a" -Actual $secondaryActual -Passed ($hasNewSecondary -and -not $hasOldSecondary)
  Add-Check -Name "External Google Fonts removed" -Expected "0 matches" -Actual ([string]$fontsGoogleCount) -Passed ($fontsGoogleCount -eq 0)

  $passed = ($checks | Where-Object { $_.Status -eq "PASS" } | Measure-Object).Count
  $failed = ($checks | Where-Object { $_.Status -eq "FAIL" } | Measure-Object).Count

  $report = [pscustomobject]@{
    CheckedAt = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss zzz")
    BaseUrl   = $base
    Headers   = [pscustomobject]@{
      ETag         = $etagHeader
      LastModified = $lastModifiedHeader
      Age          = $ageHeader
    }
    Pages     = [pscustomobject]@{
      Homepage      = [pscustomobject]@{ Status = $homepage.StatusCode; Bytes = $homepage.Bytes; Title = $homeTitle }
      TFSA          = [pscustomobject]@{ Status = $tfsa.StatusCode; Title = $tfsaTitle; Canonical = $tfsaCanonical }
      PrivacyPolicy = [pscustomobject]@{ Status = $privacy.StatusCode; Bytes = $privacy.Bytes }
      Terms         = [pscustomobject]@{ Status = $terms.StatusCode; Bytes = $terms.Bytes }
      Contact       = [pscustomobject]@{ Status = $contact.StatusCode; Bytes = $contact.Bytes }
    }
    Checks    = $checks
    Summary   = [pscustomobject]@{
      Passed = $passed
      Failed = $failed
    }
  }

  if ($Json) {
    $report | ConvertTo-Json -Depth 6
  } else {
    Write-Host ""
    Write-Host "EasyFinanceTools live verification" -ForegroundColor Cyan
    Write-Host "Base URL: $base"
    Write-Host "Checked: $($report.CheckedAt)"
    Write-Host ""
    Write-Host ("ETag:          {0}" -f $etagHeader)
    Write-Host ("Last-Modified: {0}" -f $lastModifiedHeader)
    Write-Host ("Age:           {0}" -f $(if ($ageHeader) { $ageHeader } else { "missing" }))
    Write-Host ""
    $checks | Format-Table -AutoSize
    Write-Host ""
    Write-Host ("Summary: {0} passed, {1} failed" -f $passed, $failed)
  }

  if ($failed -gt 0) {
    exit 1
  }
} finally {
  if ($null -ne $client) {
    $client.Dispose()
  }
}
