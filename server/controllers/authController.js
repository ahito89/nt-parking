const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
// const mail = require('../handlers/mail');

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      // return next(err);
      return res.status(401).send(err);
    }
    if (!user) {
      return res.status(401).send('Invalid user or password.');
      // return next(err);
    }
    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      return res.json({
        user: {
          name: user.name,
          email: user.email,
          admin: user.admin,
          _id: user._id
        }
      });
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout();
  res.json({ success: true, message: 'You are now logged out! 👋' });
};

exports.isLoggedIn = (req, res, next) => {
  // first check if the user is authenticated
  if (req.isAuthenticated()) {
    next(); // carry on! They are logged in!
    return;
  }
  res.status(401).send('Must be authenticated.');
};

exports.isAdmin = (req, res, next) => {
  // Check for admin rights
  if (!req.user && !req.user.admin) {
    res.status(401).send('Insuficient rights.');
    return;
  }
  // Hand over control to passport
  next();
};

// exports.forgot = async (req, res) => {
//   // 1. See if a user with that email exists
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     req.flash('error', 'No account with that email exists.');
//     return res.redirect('/login');
//   }
//   // 2. Set reset tokens and expiry on their account
//   user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
//   user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
//   await user.save();
//   // 3. Send them an email with the token
//   const resetURL = `http://${req.headers.host}/account/reset/${
//     user.resetPasswordToken
//   }`;
//   // await mail.send({
//   //   user,
//   //   filename: 'password-reset',
//   //   subject: 'Password Reset',
//   //   resetURL
//   // });
//   req.flash('success', `You have been emailed a password reset link.`);
//   // 4. redirect to login page
//   res.redirect('/login');
// };

// exports.reset = async (req, res) => {
//   const user = await User.findOne({
//     resetPasswordToken: req.params.token,
//     resetPasswordExpires: { $gt: Date.now() }
//   });
//   if (!user) {
//     req.flash('error', 'Password reset is invalid or has expired');
//     return res.redirect('/login');
//   }
//   // if there is a user, show the rest password form
//   res.render('reset', { title: 'Reset your Password' });
// };

// exports.confirmedPasswords = (req, res, next) => {
//   if (req.body.password === req.body['password-confirm']) {
//     next(); // keepit going!
//     return;
//   }
//   req.flash('error', 'Passwords do not match!');
//   res.redirect('back');
// };

// exports.update = async (req, res) => {
//   const user = await User.findOne({
//     resetPasswordToken: req.params.token,
//     resetPasswordExpires: { $gt: Date.now() }
//   });

//   if (!user) {
//     req.flash('error', 'Password reset is invalid or has expired');
//     return res.redirect('/login');
//   }

//   const setPassword = promisify(user.setPassword, user);
//   await setPassword(req.body.password);
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpires = undefined;
//   const updatedUser = await user.save();
//   await req.login(updatedUser);
//   req.flash(
//     'success',
//     '💃 Nice! Your password has been reset! You are now logged in!'
//   );
//   res.redirect('/');
// };
