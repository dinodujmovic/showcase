# showcase

showcase application  

- user can see all posts (description, video file)
- user can register
- user can log in
- user can upload profile avatar
- user can upload new posts 
- user can delete his posts

- admin can do all above +:
- admin can see all users
- admin can delete users
- admin can delete all posts


### Run:

1. Set APP_ENV environment variable by running the following command

   ```export APP_ENV=development``` or ```export APP_ENV=production```
    
    * For the standard Windows DOS command shell use `set` instead of `export` for environment variables.  
    * For Windows Powershell use `$env:APP_ENV = "value"`.

3. Run docker-compose build
4. Run docker-compose up

#### IF development - uncomment commented volumes for live reload
