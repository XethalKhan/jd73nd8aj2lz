# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Setup environment, see [instructions](https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build&buildEnv=local&platform=android&device=simulated):
   - Install JDK
   - Set up Android Studio
   - Set up an emulator

2. Install Maestro CLI, see [instructions](https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli)
   - Must have JDK to work

3. Install dependencies

   ```bash
   npm ci
   ```

4. Start the app

   ```bash
   npx expo run:android
   ```

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

### SonarQube

Start the local SonarQube server and its PostgreSQL database:

```bash
docker compose up -d sonarqube-db sonarqube
```

Open http://localhost:8888 and sign in with the default `admin` / `admin`
credentials. If port 8888 is already in use, start the stack with a different
`SONARQUBE_PORT` value. Create a project token for `cbsdemo`, then run the
analysis from the repository root:

```bash
npm run test:coverage
npm run lint:report
SONAR_TOKEN=your-token docker compose --profile analysis run --rm sonar-scanner
```

On PowerShell, run `$env:SONAR_TOKEN = "your-token"` first, then run the
Compose command without the inline assignment.
The scanner mounts the repository read-only and uses `sonar-project.properties`.
The lint report is generated as `reports/eslint.json` with repository-relative
paths and imported as external ESLint issues. SonarQube's native JavaScript and
TypeScript analysis remains enabled, so both native SonarQube findings and
ESLint findings are shown.
To stop the services without deleting analysis data, run:

```bash
docker compose down
```

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Designs

- [BankPick design kit](https://www.figma.com/community/file/1320093355098935734/free-banking-mobile-app-ui-kit-with-light-dark-mode-high-quality-ui-43-screen-template)
- [BankPick Community Figma file](https://www.figma.com/design/h7wZwG22b68ABMoL2PIvVd/Free-Banking-Mobile-App-Ui-Kit-With-light---Dark-Mode-High-Quality-Ui-43--Screen-template--Community-?node-id=1-5104&t=Uz1ss3jBQBM92TeI-0)
