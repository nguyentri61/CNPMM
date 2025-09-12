import Modal from "../components/Modal";
import CartList from "./CartList";
import { useCart } from "./CartProvider";
import Button from "../components/Button";

export default function CartModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { total, count, clear, items } = useCart();

  const handleCheckout = () => {
    // TODO: Tích hợp logic thanh toán (gọi API hoặc điều hướng sang trang Checkout)
    alert("Thanh toán thành công!");
    clear();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Giỏ hàng của bạn">
      {items.length === 0 ? (
        <div className="text-center py-6">Giỏ hàng trống</div>
      ) : (
        <>
          <CartList />
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Số lượng sản phẩm:</span>
              <span>{count}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Tổng tiền:</span>
              <span className="text-lg font-semibold">
                {total.toLocaleString()} đ
              </span>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="secondary" onClick={clear}>
                Xoá tất cả
              </Button>
              <Button variant="primary" onClick={handleCheckout}>
                Thanh toán
              </Button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
