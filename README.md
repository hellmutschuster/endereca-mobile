# Endereça Mobile

Endereça Mobile é um aplicativo **Android** construído com Expo e Typecript, parte do projeto da DGTI e do Geoprocessamento da SEMED para atender à demanda de uma aplicação para cadastrar e exportar endereços. Este README fornece as instruções necessárias para configurar e executar o Aplicativo.

## Pré-requisitos

Antes de executar a API, é necessário ter o NodeJS rodando em sua máquina e a linha de comando npx também.

## Instalando e Executando o Aplicativo

Para abrir o aplicativo em uma IDE

### Emulador

Primeiro, é necessário ter um emulador android executando no computador. Eu fiz esse projeto usando o emulador que vem junto com o Android Studio. Recomendo a partir da API 13 do Android

[Android Studio](https://developer.android.com/studio?hl=pt-br)

### Executando

Depois que o emulador estiver funcionando, execute os seguintes comandos:

```
git clone https://github.com/hellmutschuster/endereca-mobile .
```

```
npm install
```

```
npx expo start
```

Após isso, o Expo vai iniciar e vai dar algumas opções. Pressione "A" no terminal para executar o aplicativo no emulador Android

## Exportando como .apk

Para poder exportar o aplicativo como .apk para ser instalado em um telefone android, primeiro é necessário criar uma conta na Expo:

[Expo](https://expo.dev/)

Após isso, o seguinte comando deve ser executado

```
eas build -p android --profile preview
```
