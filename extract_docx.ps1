param([string]$Path)
Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.Web
$zip = [System.IO.Compression.ZipFile]::OpenRead($Path)
$entry = $zip.GetEntry('word/document.xml')
$sr = New-Object System.IO.StreamReader($entry.Open())
$xml = $sr.ReadToEnd()
$sr.Close()
$zip.Dispose()
$nl = [char]10
$text = $xml -replace '</w:p>', "`n"
$text = $text -replace '<[^>]+>', ''
$text = [System.Web.HttpUtility]::HtmlDecode($text)
Write-Output $text
