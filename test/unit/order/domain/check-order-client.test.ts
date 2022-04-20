import { CheckOrderClient } from '../../../../src/order/domain/check-order-client.js';
import { CheckOrder, OrderCheckup } from '../../../../src/order/domain/model/order.js';
import { OrderClient } from '../../../../src/order/domain/order-client.js';
import { buildDefaultCheckOrder, buildDefaultOrderCheckup } from '../../../builders/order/domain/order-test-builder.js';

const orderClientMock = jest.mocked(jest.genMockFromModule<OrderClient>('../../../../src/order/domain/order-client.js'), true);

let checkOrderClient: CheckOrderClient;
beforeEach(() => {
  orderClientMock.check = jest.fn();
  orderClientMock.send = jest.fn();

  checkOrderClient = new CheckOrderClient(orderClientMock);
});

describe('CheckOrderClient', () => {
  let checkOrder: CheckOrder;
  let orderCheckup: OrderCheckup;

  beforeEach(() => {
    checkOrder = buildDefaultCheckOrder();
  });

  afterEach(() => {
    expect(orderClientMock.send).toHaveBeenCalledTimes(0);
  });

  describe('Given an order to check', () => {
    describe('When order is checked', () => {
      beforeEach(() => {
        orderCheckup = buildDefaultOrderCheckup();
        orderClientMock.check.mockResolvedValue(orderCheckup);
      });

      it('Then order checkup is returned', async () => {
        const result = await checkOrderClient.check(checkOrder);
        expect(result).toEqual(orderCheckup);

        expect(orderClientMock.check).toHaveBeenCalledTimes(1);
        const checkParams = orderClientMock.check.mock.calls[0];
        expect(checkParams.length).toEqual(1);
        expect(checkParams[0]).toEqual(checkOrder);
      });
    });
  });
});
