# School mail addresses of one class, out of its Teams team, for the Nachschreiber mails of Mission Control
# (svp/leistungstest.html -> serve.py /__mail/nachschreiber -> tools/nachschreiber_mail.py).
#
#   pwsh -File tools/teams_mails_export.ps1 -Team "<exact team name>" -Gruppe BGY25
#
# Writes klassenlisten/mail-<Gruppe>.csv ("Name";"E-Mail";"Rolle", the columns of the coaching list) -
# members only, owners stay out. klassenlisten/ is gitignored: the file holds names and addresses and
# never goes into the repo. The screen shows counts only, never a name.
# Login: device code - Doc types it at https://login.microsoft.com/device (school account, owner role
# in the team is enough). The team is looked up among Doc's own teams only, by its exact name
# (a name like "BGY25-Informatik-GK2" exists twice in the tenant).
param(
    [Parameter(Mandatory = $true)][string]$Team,
    [Parameter(Mandatory = $true)][ValidatePattern('^[A-Za-z0-9_-]{1,20}$')][string]$Gruppe
)
$ErrorActionPreference = 'Stop'
$out = Join-Path (Join-Path $PSScriptRoot '..') ('klassenlisten/mail-' + $Gruppe + '.csv')

$conn = Connect-MicrosoftTeams -UseDeviceAuthentication
$hits = @(Get-Team -User $conn.Account.Id | Where-Object DisplayName -eq $Team)
if ($hits.Count -ne 1) { throw ('Team "' + $Team + '": ' + $hits.Count + ' Treffer unter deinen Teams, erwartet genau 1') }

$members = @(Get-TeamUser -GroupId $hits[0].GroupId -Role Member)
$rows = $members | Where-Object { $_.User -like '*@ibb-schulen.de' } |
    ForEach-Object { [pscustomobject]@{ 'Name' = $_.Name; 'E-Mail' = $_.User.ToLower(); 'Rolle' = 'member' } }
$rows | Export-Csv -Path $out -Delimiter ';' -Encoding utf8BOM -NoTypeInformation
Write-Host ('mail-' + $Gruppe + '.csv: ' + @($rows).Count + ' Adressen (' + $members.Count + ' Mitglieder im Team)')
