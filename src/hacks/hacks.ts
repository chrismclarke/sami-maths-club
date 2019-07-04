import { escapeRegexString } from "src/utils/utils";
import { IUploadedFileMeta } from "src/models/common.model";

// when loading a problem on android we need to replace img srcs written into html content
// with our custom path. We use regex to match this, however the html content is
// inconsistent whether img src contains '&' or '&amp;' in the string
// so slightly hacky method to try ensure images replace correctly
export function replaceContentUrls(
  content: string,
  localMeta: IUploadedFileMeta
): string {
  content = content.replace(/&amp;/g, "&");
  const regex = new RegExp(escapeRegexString(localMeta.downloadUrl), "gi");
  content = content.replace(regex, localMeta._androidPath);
  return content;
}
