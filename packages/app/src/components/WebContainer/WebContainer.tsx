import { useEffect, useRef, useState } from "react";
import { WebContainer as RealWebContainer } from "@webcontainer/api";

export const WebContainer = (): JSX.Element => {
  const [value, setValue] = useState(`console.log("42");`);
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
      if (!webContainerInstance.current) {
        return;
      }

      await webContainerInstance.current.fs.writeFile("/index.js", value);
      const echoProcess = await webContainerInstance.current.spawn("node", [
        "index.js",
      ]);

      console.log(
        new TextDecoder("utf-8").decode(
          await webContainerInstance.current.fs.readFile("/index.js")
        )
      );

      echoProcess?.output.pipeTo(
        new WritableStream({
          write(data) {
            console.log(data);
          },
        })
      );

      echoProcess.exit;
    })();
  }, [webContainerInstance.current, value]);

  return (
    <div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};
