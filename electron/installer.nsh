; Wipe stale user data on fresh install so previous library colors don't carry over
!macro customInstall
  IfFileExists "C:\Color Reduction\*.*" PromptUser SkipPrompt
PromptUser:
  MessageBox MB_YESNO|MB_ICONQUESTION "Existing library colors and settings found!$\n$\nDo you want to KEEP your old library colors?$\n$\nSelect YES to keep your colors.$\nSelect NO to fully reset and delete them." IDYES SkipPrompt
  RMDir /r "$APPDATA\Colour Reduction"
  RMDir /r "C:\Color Reduction"
SkipPrompt:
  ; Create the new C: drive directory
  CreateDirectory "C:\Color Reduction"
  
  ; Grant full control to Everyone (SID S-1-1-0) recursively so the app can read/write without admin rights
  nsExec::ExecToStack 'icacls "C:\Color Reduction" /grant *S-1-1-0:(OI)(CI)F /T'
!macroend

; Wipe user data on uninstall so nothing is left behind
!macro customUnInstall
  IfSilent SkipUninstallPrompt
  MessageBox MB_YESNO|MB_ICONQUESTION "Do you want to permanently delete your library colors and settings?$\n$\nSelect YES to delete everything.$\nSelect NO to keep your data for a future reinstallation." IDNO SkipUninstallPrompt
  RMDir /r "$APPDATA\Colour Reduction"
  RMDir /r "C:\Color Reduction"
SkipUninstallPrompt:
!macroend
