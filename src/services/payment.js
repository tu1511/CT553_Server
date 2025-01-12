const prisma = require("../config/prismaClient");

class PaymentService {
  static async getPaymentMethods() {
    return await prisma.paymentMethod.findMany();
  }

  static async getPaymentStatuses() {
    return await prisma.paymentStatus.findMany();
  }
}

module.exports = PaymentService;
