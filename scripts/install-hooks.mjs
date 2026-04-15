import { execSync } from 'node:child_process';
import { accessSync, constants } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const hookPath = path.join('.githooks', 'pre-commit');

try {
  accessSync('.git', constants.F_OK);
  accessSync(hookPath, constants.F_OK);
} catch {
  process.exit(0);
}

try {
  execSync('git config core.hooksPath .githooks', { stdio: 'ignore' });
  execSync(`chmod +x ${hookPath}`, { stdio: 'ignore' });
  process.stdout.write('Configured git hooks at .githooks\n');
} catch {
  process.stderr.write('Could not configure git hooks automatically. Run: npm run hooks:install\n');
}
