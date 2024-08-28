import { fetchFile } from "@ffmpeg/util";
import { $resultInProgress, $resultPercents } from "../../../store/atoms/result-atoms";
import { getFFmpeg } from "./load";

interface ICutOptions {
  fromMs?: number;
  toMs?: number;
}

interface IOptions {
  cut?: ICutOptions;
  quality?: number;
}

export async function transcode(file: File, options?: IOptions): Promise<File> {
  $resultInProgress.set(true);
  try {
    const ffmpeg = await getFFmpeg();
    console.log("ffmpeg", ffmpeg);

    ffmpeg.on("log", log => {
      console.log(log);
    });

    ffmpeg.on("progress", ({ progress, time }) => {
      console.log("ffmpeg", `${progress * 100} % (transcoded time: ${time / 1000000} s)`);
      $resultPercents.set(Math.floor(progress * 10_000) / 100);
    });

    const res = await ffmpeg.writeFile(file.name, await fetchFile(file));
    console.log("transcode writeFile", res);

    const execRes = await ffmpeg.exec([
      "-ss",
      "00:00:00",
      "-t",
      "00:0:5",
      "-i",
      file.name,
      "-c:a",
      "copy",
      outputFile,
    ]);
    console.log("transcode execRes", execRes);

    const data = await ffmpeg.readFile(outputFile);
    console.log("transcode data", data);

    return new File([data], file.name, { type: "video/mp4" });
  } finally {
    $resultInProgress.set(false);
  }
}

const outputFile = "output.mp4";
