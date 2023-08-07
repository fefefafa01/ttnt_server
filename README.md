
### Vietnamese
`Tên dự án: Vehicle Parts Sales Business`

**Server:** Nodejs v18.16.0 | Express v4.18.1

**Client:** Reactjs v18.2.0

**Database:** postgreSQL v15.3

**Packages Installer:** npm hoặc yarn

**Server (nằm trong thư mục /server):**
    1. Mở file constindex.js trong folder /bin/constants chỉnh sửa lại thông số về nơi đặt client và cổng của server.
    2. Mở file .env trong folder server chỉnh sửa lại cài đặt về database cho phù hợp.
    3. Tại folder server mở CMD/Terminal và nhập lệnh: `"npm install"` hoặc `"yarn install"` để cài dependencies.
    4. Tại folder server mở CMD/Terminal và nhập lệnh" `"npm start"` hoặc `"yarn start"` để khởi động server.
        __Lưu Ý:__ Cổng mặc định của Server là 5000. Nếu cần đổi cổng: Ở thư mục server, mở package.json, ở dòng `"start": "node ./app.js"` thêm `"set PORT=[cổng muốn đổi] && "` ở trước "node". Sau đó vào thư mục client/src/constants và truy cập file constindex.js và chỉnh sửa lại đường dẫn vào server cho phù hợp.

**Client (nằm trong thư mục /client):**
    1. Mở file constindex.js trong folder /src/constants chỉnh sửa lại thông số về nơi đặt server.
    2. Tại folder client mở CMD/Terminal và nhập lệnh: `"npm install"` hoặc `"yarn install"` để cài dependencies.
    3. Tại folder client mở CMD/Terminal và nhập lệnh" `"npm start"` hoặc `"yarn start"` để khởi động client.
        __Lưu Ý:__ Cổng mặc định của Client là 3000. Nếu cần đổi cổng: Ở thư mục client, mở package.json, ở dòng `"start": "react-scripts start"` thêm `"set PORT=[cổng muốn đổi] && "` ở trước "react-scripts". Sau đó vào thư mục server/bin/constants và truy cập file constindex.js và chỉnh sửa lại đường dẫn vào client cho phù hợp.


### English
`Project: Vehicle Parts Sales Business`

**Server:** Nodejs v18.16.0 | Express v4.18.1

**Client:** Reactjs v18.2.0

**Database:** postgreSQL v15.3

**Packages Installer:** npm or yarn

**Server (Located in /server folder):**
    1. Open constindex.js in folder /bin/constants to change where the client is put and server's port.
    2. Open .env in server folder to configure database host and user.
    3. In server folder, open CMD/Terminal and type: `"npm install"` or `"yarn install"` to install dependencies.
    4. In server folder, open CMD/Terminal and type: `"npm start"` or `"yarn start"` to start the server.
        __Note:__ Server's default port is 5000. In case of changing port: Inside server folder, open package.json, at line `"start": "node ./app.js"` add `"set PORT=[port] && "` before the "node". After that, access client/src/constants and open constindex.js then update the server's link to fit your port changes. 

**Client (Located in /client folder):**
    1. Open constindex.js in folder /src/constants to change where the server is put
    2. In client folder, open CMD/Terminal and type: `"npm install"` or `"yarn install"` to install dependencies.
    3. In client folder, open CMD/Terminal and type: `"npm start"` or `"yarn start"` to start the client.
        __Note:__ Client's default port is 3000. In case of changing port: Inside client folder, open package.json, at line `"start": "react-scripts start"` add `"set PORT=[port]"` before the "react-scripts". After that, access server/bin/constants and open constindex.js then update the client's link to fit your port changes.
