param(
  [Parameter(Mandatory=$true)] [string] $SourcePdf,
  [Parameter(Mandatory=$true)] [string] $DestDocx
)
$wdFormatDocumentDefault = 16
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
$word.Options.ConfirmConversions = $false
try {
  $doc = $word.Documents.Open($SourcePdf, $false, $true)
  $doc.SaveAs2($DestDocx, $wdFormatDocumentDefault)
  $doc.Close($false)
  Write-Host "OK: $DestDocx ($((Get-Item $DestDocx).Length) bytes)"
} finally {
  $word.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
