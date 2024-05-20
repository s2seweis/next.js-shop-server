const express = require('express');
const ResetRepo = require('../repos/reset-repos');

const router = express.Router();

// Route to handle password reset request
router.post('/requestResetPassword', async (req, res) => {
  const { email } = req.body;

  try {
    // Request password reset
    const result = await ResetRepo.requestPasswordReset(email);
    
    res.status(200).json({ message: 'Password reset link sent successfully', link: result.link });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle password reset
router.post('/resetPassword', async (req, res) => {
    const { userId, token, password } = req.body;
    const user_id = userId;
    try {
        // Reset the user's password
        const user = await ResetRepo.resetPassword(user_id, token, password);

        // Password successfully reset
        return res.status(200).json({ message: 'Password reset successfully', user });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ error: error.message || 'Failed to reset password' });
    }
});


module.exports = router;
