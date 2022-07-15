# Spendistry Backend
Backend for Spendistry: the new-gen invoice system project

## Highlights
* Registration & Login
* Returning a jwt-Token on Login/Registration
* Verification of jwt-Token validity
* Sending invoice to user
* Manage invoices from one place

## API Endpoints

### User Side Account

1. ```/auth/``` for creating account for user side application.

2. ```/auth/:id/``` (GET Method) to fetch user details with it's unque id. id is passed through url parameters.

3. ```/auth/userLogin/``` (POST Method)for user login. email and password are sent through post request.

4. ```/auth/:id/``` (PATCH Method) to update password.

5. ```/auth/:id/``` (DELETE Method) to delete account.

### Business Side Account

1. ```/authBusiness/:id/``` (GET Method) to fetch business side account data.

2. ```/authBusiness/``` for creating busness side account.

3. ```/authBusiness/vendorLogin/``` (POST Method) used to login for business account.

4. ```/authBusiness/:id/``` (PATCH Method) to update password and encrypt it.

5. ```/authBusiness/:id/``` (DELETE Method) to delete account.

### User/Business Details

1. ```/user/``` (POST Method) It can be used to upload  user data to server.

2. ```/user/:id/``` (PATCH Method) to update user data.

3. ```/user/uploadImage/:id/``` (POST Method) to upload profile pic to server.

4. ```/user/deleteImage/:id/``` (DELETE Method) to delete profile pic.

### For Dashboard data

1. ```/invoice/total/:id/``` (GET Method) It'll return data for dashboard with business name, monthly and yearly total, qr code string, roundoff income of last 30 days.

2. ```/mud/:userId/``` (GET Method) It'll return data android phone business side app dashboard.

3. ```/mvd/:userId/``` (GET Method) It'll return data for user side android application dashboard.

### Invoice Endpoints

1. ```/invoice/vendor/:id/``` (GET Method) to get specific business with business id

2. ```/invoice/share/:id/``` (GET Method) to get string of user qr code

3. ```/invoice/addEle/:userId/:businessId/``` (POST Method) this will create invoice in that specific user's id, if that user has already bought from that place it'll add invoice to that business otherwise it'll create new business and add invoice to it.

4. ```/invoice/findEle/:businessId/``` (GET Method) to get all invoice from that specific business id

5. ```/invoice/findEle/:userId/:businessId/``` (GET Method) to find specific invoices for user from specific business

6. ```/invoice/findEle/:userId/:businessId/:InvoiceId/```  (GET Method) to find one specific invoice

7. ```/invoice/patchEle/:userId/:businessId/:invoiceId/:reportId/``` (PATCH Method) to update current reported invoice. and add old invoice to ```/return/```.

### Inventory Creation

1. ```/itemsPrices/``` (POST Method) to create itemPrices array

2. ```/itemPrices/addItems/:id/``` (PATCH Method) to add more items in inventory for business

3. ```/itemPrices/updateItems/:id/``` (PATCH Method) to update inveotory item details.

4. ```/itemPrices/deleteItems/:id/:idArr/``` (DELETE Method) to delete specific inventory item.

### OTP sending and matching

1. ```/OTP/forgotPassword/``` (POST Method) It'll send OPT to email sent into post method.

2. ```/OTP/createAccount/``` (POST Method) send email to new users while creating account.

3. ```/OTP/verifyOTP/``` (POST Method) to verify OTP typed into phone or website.

### PDF Download 

1. ```/PDF/:userId/:businessId/:invoiceId/``` (GET Method) to download/get invoice pdf of that specific invoice.

### Report Invoice

1. ```/report/``` (POST Method) to report invoice (from user side application/website).

2. ```/report/:id/``` (PATCH Method) to update reported invoice details.

3. ```/report/reportTo/:reportTo/``` (GET Method) It'll get all reported invoice details with email id from it reported.


