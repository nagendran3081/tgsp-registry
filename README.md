# TGSP Registry — Android APK ప్రాజెక్ట్

ఇది ఫోన్‌లో ఇన్‌స్టాల్ అయ్యే offline app (Excel లాంటి షీట్లు + PDF/Excel అప్‌లోడ్).
అన్ని వివరాలు ఫోన్‌లోనే ఉంటాయి (server/internet అవసరం లేదు).

## APK తయారు చేయడం — మార్గం A: GitHub (కంప్యూటర్ అవసరం లేదు, ఫోన్ browser చాలు)
1. github.com లో ఉచిత account తెరవండి. కొత్త **Private** repository తయారు చేయండి (పేరు: tgsp-registry).
2. ఈ zip ని extract చేసి, లోపలి ఫైళ్లు/ఫోల్డర్లు అన్నీ repository లోకి upload చేయండి
   ("Add file → Upload files"). `.github/workflows/build-apk.yml` కూడా ఉండాలి.
   (ఫోన్‌లో hidden folder `.github` upload కాకపోతే, కంప్యూటర్ నుంచి చేయండి లేదా
   "Create new file" లో `.github/workflows/build-apk.yml` అని పేరు పెట్టి ఆ ఫైల్ లోని text paste చేయండి.)
3. repository లో **Actions** ట్యాబ్ → "Build APK" → **Run workflow** నొక్కండి. 5–10 నిమిషాలు పడుతుంది.
4. పూర్తయ్యాక ఆ run తెరిచి కింద **Artifacts → TGSP-Registry-APK** download చేయండి (zip లో app-debug.apk ఉంటుంది).
5. APK ని ఫోన్‌కు పంపి, తెరిచి install చేయండి ("Unknown sources/ఈ source నుంచి install" అనుమతించాలి).

## మార్గం B: Android Studio (కంప్యూటర్)
    npm install
    npx cap add android
    npx cap sync android
    npx cap open android      # Android Studio లో Build > Build APK(s)

## ఎలా వాడాలి
- పైన ట్యాబ్‌లు: Profile (వెతకడం + 6 పేజీల వివరాలు), Personal Details, Posting Details … ఒక్కో షీట్.
- గడులపై నేరుగా టైప్ చేయండి. Excel నుంచి cells కాపీ చేసి ఏ గడిలోనైనా paste చేయవచ్చు.
- "Import / Backup": PDF upload (HRMS Personal Registry), Excel (.xlsx)/CSV upload, JSON backup.
- Excel upload: షీట్ పేర్లు యాప్ ట్యాబ్ పేర్ల లాగే ఉండాలి; ప్రతి షీట్ లో మొదటి row headers, మొదటి column empid.

## గమనికలు
- PDF నుంచి Vaccination, PRC రావు (PDF layout వల్ల). మిగతావి వస్తాయి; import తర్వాత Profile లో సరిచూడండి.
- .xls (పాత Excel) చదవదు — Excel లో "Save as .xlsx" చేయండి.
- ఫోటోలు లేవు.
- డేటా ఫోన్‌లో మాత్రమే ఉంటుంది; app uninstall చేస్తే పోతుంది. తరచూ "Copy JSON backup" తీసుకుని భద్రపరచండి.
- ఇది debug-signed APK (సొంత వాడకానికి). Play Store కోసం కాదు.
- అధికారిక HRMS తో కనెక్ట్ కాదు. సున్నితమైన డేటా — Aadhaar/PAN/bank పూర్తి నంబర్లు ఉంచవద్దు, ఫోన్‌కు lock పెట్టండి.
