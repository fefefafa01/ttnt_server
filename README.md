*Run and Build Source - Server*
- In terminal, **"git pull" (or "git pull origin/develop")** to get latest runable update
`( If device hasn't installed yarn yet, please do install it with "npm i --global yarn")`
- Then **"yarn install"** to get all dependencies before running
- Inside `"loggers.js"`, there is a require named `"@whatsapp-clone/common-validate"`.
    Hold CTRL and Click into it, then *"index.js"* will be opened.
    Inside that file, at `"username: Yup.string()"`, __change the "username" into "email"__ and **delete** 2 lines of "min(xx, xx)", "max(xx, xx)"
    *Do not delete the password min max*
- Then **"yarn start"** to start running

*Guide to check server connection:*
Server connection is simply put in one sole file, **"constindex.js"**
There are `**2 rows**` which are needed to be checked.
    - frontlocale: Give connection that bypasses CORS. Check if it matches your client/frontend both the link and port
    - port: Check if the number (Default: 5000) matches with the client's port accessing at the end in `client's constindex.js` (Example: http://localhost:**5000**/xxx).
        *If not, go to **package.json**. At the ""start:" "node ./app.js"", change it
        to "set PORT = [current client chosen port, E.g: 5005] && node ./app.js"
        Then change the port in constindex.js with __port="xxxx"__ as xxxx is the same number