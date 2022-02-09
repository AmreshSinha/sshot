---
label: Contributing
icon: book
---
# Contributing

Thanks for investing some of your time for contributing to this project :blush:! Make sure you read our [Code of Conduct](./CODE_OF_CONDUCT.md) once before contributing to keep our community safe, approachable and respectable for all.

## For New Comers 👋

If you are new to Contributing to Open Source :confetti_ball: then make sure you first practice git and how to use github. We will be more than happy if your first contribution is done to sshot :sparkles:!

## Getting Started 🚀

Make sure you are good with branching and pull requests.

1) Before contributing to sshot, first fork it and clone to your local machine.

2) Create a new branch 

   `git checkout -b [name_of_your_new_branch]`

   with naming convention as given below:

   `TYPE-ISSUE_ID-DESCRIPTION`

   example:
 
   If you are assigned to a issue which is a bug report with issue id `#23` then your branch name will be
 
   ```
   bug-23-link-without-http-s-is-not-valid
   ```
 
   ![image](https://user-images.githubusercontent.com/35039730/153134660-88425451-6d43-4fa9-ac49-2d5c24e23fd6.png)
 
   All Issue Codes:
 
   | Issue Type            | Code       |
   | --------------------- | ---------- |
   | Bug Report            | `bug`      |
   | Documentation Issue   | `doc`      |
   | Feature Request       | `feat`     |
   | Seurity Vulnerability | `security` |
   | Miscellaneous         | `misc`     |
 
   For security Vulnerability kindly mail me at [amresh@duck.com](mailto:amresh@duck.com) instead of opening an issue. 🤝

3) Push changes to Github
   ```
   git push origin [name_of_your_new_branch]
   ```

4) Submit your changes for review If you go to your repository on GitHub, you'll see a Compare & pull request button. Click on that button.

5) Click on `Create pull request` and set target branch as `main`.

6) Wait till any maintainer reviews your code.

7) After approval your changes will be merged by the maintainer.

8) You can now safely delete your branch and fork. (But make sure you don't delete it before your Pull Request is merged)

## Development Setup 💻

Setting up sshot for development is quite straightforward.

1) In your fork clone install all the dependencies
   
   ```
   npm i
   ```

2) (OPTIONAL) If you are fixing or adding anything to documentation then make sure you have retype globally installed. 

   (If documentation is the only thing you are resolving then you can ignore Step-1 too!)

   ```
   npm i -g retypeapp
   ```

   Now you can run 
   
   ```retype watch```

   This will build and run the documentation and will auto reload if any changes is made.

3) Now run
   
   ```
   npm run dev
   ```

   Nodemon watches for changes and auto reloads if any changes is detected!

That's it for the development setup!

### Further Info 🔧

sshot uses `puppeteer` and chrome in background for taking screenshot. If your machine is not a `x86_64` based then you may need to do some additional setup.

Let's take a instance of `aarch64` based ubuntu machine.

`puppeteer` will not download chromium by default on `aarch64` so you will need to install `chromium-browser` yourself.

Also, do note `chromium-browser` package is not available on `debian`. It's only available on `ubuntu`.

```
sudo apt install chromium-browser
```

This will install chromium-browser at

```
/usr/bin/chromium-browser
```

I have pre-configured puppeteer script for this instance so you just need to run the above command and you are good to go!

If you are running a different os then you may need to install `chromium` on your own. And then change the `executablePath` in `./src/puppeteer.js` to the installation path of chromium browser.

And as always you can open an issue or ping me up on mail if you have any problem: [amresh@duck.com](mailto:amresh@duck.com)

## Security 🔐, Privacy 🕵️ & Speed 🚀

Make sure your implementation don't have any security flaws, or violates any Privacy and is fast enough! 

We will be more than happy to help you with your implementation if you are stuck somewhere or need any guidance! 🤗

## Dependencies 📦

While working on any implementation please avoid introducing new dependencies to sshot. We know that a dependency can cut the amount of work needed in implementation and can make it less time consuming. But it can add security issues or any other vital issue.

If you are still thinking to add one then make sure it has a nice reputation, has a vital usecase for the implementation and has the least possible chance of risk.

## Tests 🤖

Currently there aren't any tests. We will be more than happy if you add some!

## Other ways to help 🤗

- Incorporating in your Blog
- Incorporating in any of your Project
- Sending Feedbacks
- Discussing on New Ideas
- Fixing and Improving Documentation
- Helping someone with their issue