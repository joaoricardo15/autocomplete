import { Button, Modal, Typography } from "@mui/material";
import React, { createContext, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

// Centralized error handler
export const ErrorContext = createContext<{
  publishLog: (error: unknown, message?: string, stack?: string) => void;
}>({
  publishLog: () => undefined,
});

const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [errorMessage, setErrorMessage] = useState<string>();

  const publishLog = (error: unknown) => {
    const { errorMessage, errorFile, errorObject } = parseError(error);

    setErrorMessage(errorMessage);

    // Publish error to Sentry, Bugsnag, CloudWatch, etc...
    console.log("publishLog: ", errorMessage, errorFile, errorObject);
  };

  const resetError = () => {
    setErrorMessage("");
  };

  useEffect(() => {
    window.addEventListener("error", publishLog);
    window.addEventListener("unhandledrejection", publishLog);

    return () => {
      window.removeEventListener("error", publishLog);
      window.removeEventListener("unhandledrejection", publishLog);
    };
  }, []);

  // It renders ErrorPage both from errors catched
  // on global EventListeners and react-error-boundary
  return (
    <ErrorContext.Provider value={{ publishLog }}>
      {errorMessage ? (
        <ErrorComponent
          errorMessage={errorMessage}
          buttonCallback={resetError}
        />
      ) : (
        <ErrorBoundary
          FallbackComponent={() => (
            <ErrorComponent
              errorMessage={errorMessage}
              buttonCallback={resetError}
            />
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </ErrorContext.Provider>
  );
};

export default ErrorProvider;

const ErrorComponent: React.FC<{
  errorMessage?: string;
  buttonCallback: Function;
}> = ({ errorMessage, buttonCallback }) => {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <Modal open={open} data-testid="errorContainer">
      <div
        style={{
          padding: 20,
          width: "500px",
          margin: "auto",
          marginTop: 100,
          backgroundColor: "#fff",
        }}
      >
        <div>
          <Typography variant="h4">Error!!!</Typography>
          <Typography style={{ marginTop: 10 }}>{errorMessage}</Typography>
          <Button
            style={{ marginTop: 10 }}
            onClick={() => {
              setOpen(false);
              buttonCallback();
            }}
          >
            Try Again
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const parseError = (
  error: unknown
): { errorMessage: string; errorFile: string; errorObject: any } => {
  if (error instanceof Error) {
    const { message, stack, cause } = error;
    return {
      errorMessage: message,
      errorFile: stack || "",
      errorObject: cause,
    };
  } else if (error instanceof ErrorEvent) {
    const { message, filename, error: errorObject } = error;
    return {
      errorMessage: message,
      errorFile: filename,
      errorObject: errorObject,
    };
  } else if (error instanceof PromiseRejectionEvent) {
    const {
      reason: { message, stack, cause },
    } = error;
    return {
      errorMessage: message,
      errorFile: stack,
      errorObject: cause,
    };
  }

  return {
    errorMessage: "Untracked error",
    errorFile: "Untracked file",
    errorObject: error,
  };
};
