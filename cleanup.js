const fs = require('fs');
const dir = 'C:\\Color Reduction';
if (fs.existsSync(dir)) {
  fs.rmSync(dir, { recursive: true, force: true });
  console.log('Cleaned up C:\\Color Reduction');
} else {
  console.log('Already clean');
}
