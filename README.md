# PlayTranslate Mobile

Aplicativo mobile inspirado no PlayTranslate, feito com React Native + Expo.

## Recursos
- Tradução de texto entre idiomas (API pública LibreTranslate)
- Inversão de idiomas com troca dos textos
- Leitura em voz alta com `expo-speech`
- Cópia da tradução com `expo-clipboard`

## Rodar localmente
1. Instale dependências:
   ```bash
   npm install
   ```
2. Inicie o Expo:
   ```bash
   npm run start
   ```
3. Abra no celular com Expo Go (QR code no terminal).

## Instalar via GitHub Actions (APK)
Este repositório inclui workflow em `.github/workflows/android-apk.yml` para gerar APK Android.

### Como gerar
1. Faça push para a branch `main` (ou execute manualmente em **Actions > Build Android APK > Run workflow**).
2. Aguarde o job `build-apk` finalizar.
3. Baixe o artefato **playtranslate-mobile-debug-apk**.
4. No Android, instale o arquivo `app-debug.apk`.

> Observação: por ser build `debug`, o Android pode pedir confirmação para instalar app de fonte externa.
