import React from 'react';

export function lazyWithPreload(loader) {
  let LoadedComponent;
  let loadPromise;

  const load = () => {
    if (LoadedComponent) {
      return Promise.resolve(LoadedComponent);
    }

    if (!loadPromise) {
      loadPromise = loader().then((module) => {
        LoadedComponent = module.default || module;
        return LoadedComponent;
      });
    }

    return loadPromise;
  };

  function PreloadableLazy(props) {
    const [, setLoadVersion] = React.useState(0);

    React.useEffect(() => {
      if (LoadedComponent) return undefined;

      let isMounted = true;
      load().then(() => {
        if (isMounted) {
          setLoadVersion((version) => version + 1);
        }
      });

      return () => {
        isMounted = false;
      };
    }, []);

    if (LoadedComponent) {
      return <LoadedComponent {...props} />;
    }

    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" aria-label="Loading page" />
      </div>
    );
  }

  PreloadableLazy.preload = load;

  return PreloadableLazy;
}
