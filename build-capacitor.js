const { spawn } = require('child_process');

// alias spawn
const exec = (commands) => {
  spawn(commands, { stdio: 'inherit', shell: true });
};

// use like this
if (process.env.NODE_ENV === 'stage') {
  exec(
    'npm run build-stage && npx cap copy web && npx cap sync'
  );
} else if (process.env.NODE_ENV === 'prod') {
  exec(
    'npm run build-prod && npx cap copy web && npx cap sync'
  );
} else {
  exec(
    'npm run build-dev && npx cap copy web && npx cap sync'
  );
}
