export default function getFileName(path) {
  return path.split("/").slice(-1).pop();
}
