; Wipe stale user data on fresh install so previous library colors don't carry over
!macro customInstall
  RMDir /r "$APPDATA\Colour Reduction"
  RMDir /r "C:\Color Reduction"
  
  ; Create the new C: drive directory
  CreateDirectory "C:\Color Reduction"
  
  ; Grant full control to Everyone (SID S-1-1-0) recursively so the app can read/write without admin rights
  nsExec::ExecToStack 'icacls "C:\Color Reduction" /grant *S-1-1-0:(OI)(CI)F /T'
!macroend

; Wipe user data on uninstall so nothing is left behind
!macro customUnInstall
  RMDir /r "$APPDATA\Colour Reduction"
  
  ; Remove the C: drive directory
  RMDir /r "C:\Color Reduction"
!macroend
