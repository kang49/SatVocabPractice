import { exec } from 'child_process';

// พาธไฟล์ของ Python script
const pythonScriptPath = '/Users/kang49/Desktop/SatVocabPractice/createChart.py';

export function ShowStats() {
  // คำสั่งสำหรับเรียกใช้ Python script ด้วย virtual environment
  const command = `python3 -m venv myenv && source myenv/bin/activate && python3 -m pip install matplotlib && python3 ${pythonScriptPath}`;

  exec(command, (error, stdout, stderr) => {
      if (error) {
          console.error(`exec error: ${error}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
  });
}