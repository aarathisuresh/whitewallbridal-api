import AtelierOrder from '../models/AtelierOrder.js';

// POST /api/atelier-orders  — public (customers submit custom-design requests;
// admins record social / website orders)
export const createAtelierOrder = async (req, res) => {
  try {
    const {
      orderCode, clientName, email, phone, address, source, items, total,
      status, isCustom, metrics, notes, instagramHandle, interactionNotes,
      paymentStatus, amountPaid, paymentMethod, trackingId, courier, referenceImages,
    } = req.body;

    if (!clientName) {
      return res.status(400).json({ message: 'Client name is required.' });
    }

    const order = await AtelierOrder.create({
      orderCode,
      clientName,
      email,
      phone,
      address,
      source,
      items,
      total,
      status,
      isCustom,
      metrics,
      notes,
      instagramHandle,
      interactionNotes,
      paymentStatus,
      amountPaid,
      paymentMethod,
      trackingId,
      courier,
      referenceImages,
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error('createAtelierOrder failed:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/atelier-orders  — admin only
export const getAllAtelierOrders = async (req, res) => {
  try {
    const orders = await AtelierOrder.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error('getAllAtelierOrders failed:', error);
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/atelier-orders/:id  — admin only (inline status / payment / delivery edits)
export const updateAtelierOrder = async (req, res) => {
  try {
    const updated = await AtelierOrder.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('updateAtelierOrder failed:', error);
    res.status(500).json({ message: error.message });
  }
};