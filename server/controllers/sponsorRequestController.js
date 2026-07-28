import { SponsorRequestModel } from "../models/sponsorRequestModel.js";

// Submit a new sponsorship request (Public)
export const createSponsorRequest = async (req, res) => {
  try {
    const { name, email, contactNumber, imageUrl, reason } = req.body;

    if (!name || !email || !contactNumber || !reason) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    const newRequest = await SponsorRequestModel.create({
      name,
      email,
      contactNumber,
      imageUrl,
      reason
    });

    res.status(201).json({ success: true, message: "Request submitted successfully", data: newRequest });
  } catch (error) {
    console.error("Error creating sponsor request:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all sponsorship requests (Admin)
export const getAllSponsorRequests = async (req, res) => {
  try {
    const requests = await SponsorRequestModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("Error fetching sponsor requests:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Toggle highlight status for a request (Admin)
export const toggleHighlight = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await SponsorRequestModel.findById(id);

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    // If we are trying to highlight it, ensure we don't exceed 5 highlighted items
    if (!request.isHighlighted) {
      const highlightedCount = await SponsorRequestModel.countDocuments({ isHighlighted: true });
      if (highlightedCount >= 5) {
        return res.status(400).json({ 
          success: false, 
          message: "You can only highlight up to 5 students. Please unhighlight another student first." 
        });
      }
    }

    request.isHighlighted = !request.isHighlighted;
    await request.save();

    res.status(200).json({ success: true, message: "Highlight status updated", request });
  } catch (error) {
    console.error("Error toggling highlight:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get only highlighted requests (Public)
export const getHighlightedRequests = async (req, res) => {
  try {
    const highlightedRequests = await SponsorRequestModel.find({ isHighlighted: true }).limit(5);
    res.status(200).json({ success: true, requests: highlightedRequests });
  } catch (error) {
    console.error("Error fetching highlighted requests:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a request (Admin)
export const deleteSponsorRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SponsorRequestModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }
    res.status(200).json({ success: true, message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
