const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://3b40c9a8-762b-4a3b-93e2-8423a8947092@api.glitch.com/git/smiling-fine-kiss|https://3b40c9a8-762b-4a3b-93e2-8423a8947092@api.glitch.com/git/olive-deadpan-henley|https://3b40c9a8-762b-4a3b-93e2-8423a8947092@api.glitch.com/git/sticky-magnetic-bumper|https://3b40c9a8-762b-4a3b-93e2-8423a8947092@api.glitch.com/git/prickly-bronzed-calliandra|https://3b40c9a8-762b-4a3b-93e2-8423a8947092@api.glitch.com/git/able-bow-pump|https://3b40c9a8-762b-4a3b-93e2-8423a8947092@api.glitch.com/git/flower-aquamarine-sneezeweed|https://3b40c9a8-762b-4a3b-93e2-8423a8947092@api.glitch.com/git/wooded-buttercup-pulsar|https://3b40c9a8-762b-4a3b-93e2-8423a8947092@api.glitch.com/git/kiwi-economic-bangle|https://3b40c9a8-762b-4a3b-93e2-8423a8947092@api.glitch.com/git/attractive-calm-condor|https://3b40c9a8-762b-4a3b-93e2-8423a8947092@api.glitch.com/git/accurate-lopsided-gallimimus|https://3b40c9a8-762b-4a3b-93e2-8423a8947092@api.glitch.com/git/awesome-freckle-war|https://3b40c9a8-762b-4a3b-93e2-8423a8947092@api.glitch.com/git/carnation-cherry-adasaurus|https://3b40c9a8-762b-4a3b-93e2-8423a8947092@api.glitch.com/git/butternut-fearless-tsunami|https://3b40c9a8-762b-4a3b-93e2-8423a8947092@api.glitch.com/git/fluff-sedate-hellebore`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();