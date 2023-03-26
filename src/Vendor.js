// @ts-check
import { ungzip } from "pako";
import untar from "js-untar";

export const extractTargz = async (buf) => {
  const out = ungzip(new Uint8Array(buf));

  const files = await untar(out.buffer);
  // .progress((extractedFile) => {
  //   console.log("progress", extractedFile);
  // })

  return files.map(({ name, buffer }) => {
    return {
      name,
      code: new TextDecoder().decode(buffer),
    };
  });
};
