export const getCurrentUser = async (req, res) => {
    try{
        return res.status(200).json({ success: true, user: req.user });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
}