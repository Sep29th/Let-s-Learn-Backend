import * as bcrypt from 'bcrypt';

(async () => {
  console.log(await bcrypt.genSalt());
})();
