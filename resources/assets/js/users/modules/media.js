export const supportedMimeTypes = [
  { mime: 'image/png', icon: 'image', label: 'Picture' },
  { mime: 'image/jpeg', icon: 'image', label: 'Picture' },
  { mime: 'audio/mpeg', icon: 'music', label: 'Audio' },
  { mime: 'application/pdf', icon: 'file-pdf', label: 'PDF Document' },
  { mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', icon: 'file-word', label: 'Word Document' },
  { mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', icon: 'file-excel', label: 'Spreadsheet' },
  { mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', icon: 'file-powerpoint', label: 'Presentation' },
]

export const isMimeTypeSupported = mime =>
  supportedMimeTypes.filter( mimeType => mimeType.mime === mime ).length > 0;

export const getLabel = mime =>
  isMimeTypeSupported( mime ) ? supportedMimeTypes.filter( mimeType => mimeType.mime === mime )[0].label : 'Unknown File';
export const getIcon = mime =>
  isMimeTypeSupported( mime ) ? supportedMimeTypes.filter( mimeType => mimeType.mime === mime )[0].icon : 'file';