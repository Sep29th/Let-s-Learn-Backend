import { exec } from 'child_process';
import * as path from 'path';

// Get the argument from the command line (e.g., 'google')
const protoFile = process.argv[2];

if (!protoFile) {
  console.error('Please provide the proto file name!');
  process.exit(1);
}

// Resolve paths for protoc-gen-ts and output directories
const protocGenTs = path.resolve('./node_modules/.bin/protoc-gen-ts_proto.CMD');
const outputDir = path.resolve('./libs/proto/src/generated');
const protoPath = path.resolve(`./libs/proto/src/protoc/${protoFile}.proto`);
const protoDir = path.resolve('./libs/proto/src/protoc'); // Path to proto directory

// Command to run protoc with the necessary arguments
const command = `protoc \
  --proto_path="${protoDir}" \
  --plugin="protoc-gen-ts=${protocGenTs}" \
  --ts_opt=snakeToCamel=false \
  --ts_opt=nestJs=true \
  --ts_opt=returnObservable=true \
  --ts_out="${outputDir}" \
  ${protoPath}`;

// Execute the protoc command
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing protoc: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`Error: ${stderr}`);
    return;
  }

  console.log(`Success ${stdout}`);
});
