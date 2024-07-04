import { useEffect, useRef, useState } from "react";
import { WebContainer as RealWebContainer } from "@webcontainer/api";

export const WebContainer = (): JSX.Element => {
  const [booting, setBooting] = useState(false);
  const webContainerInstance = useRef<RealWebContainer>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const bootWebContainer = async () => {
    setBooting(true);
    try {
      webContainerInstance.current = await RealWebContainer.boot();
    } catch (error) {
      console.error(error);
    } finally {
      setBooting(false);
    }
  };

  useEffect(() => {
    if (!!webContainerInstance.current || booting) {
      return;
    }

    bootWebContainer();
  }, []);

  useEffect(() => {
    (async () => {
      const echoProcess = await webContainerInstance.current?.spawn("echo", [
        "Hello, World!",
      ]);
      echoProcess?.output.pipeTo(
        new WritableStream({
          write(data) {
            console.log(data);
          },
        })
      );
    })();
  }, [webContainerInstance.current]);

  return (
    <div>
      <h1>Pending</h1>
    </div>
  );
};
