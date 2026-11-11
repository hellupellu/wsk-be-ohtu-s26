# Assignment 6 - Authentication and authorization

In this assignment I added login with JWT and used bcrypt for passwords.

There is two roles, admin and user.

- Normal user can only edit and delete their own cats and user info.
- Admin can edit and delete everything.
- Normal user can't change their role to admin.
- Some routes need token to work.

I tested with VS Code REST Client. Login and JWT token worked. I also tested that user can't edit or delete other users cats or info.

I haven't tested admin yet.
