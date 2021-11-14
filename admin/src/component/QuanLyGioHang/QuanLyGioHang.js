import React, { Component } from "react";
import "./QuanLyGioHang.css";
import { DataGrid } from "@mui/x-data-grid";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SpellcheckOutlinedIcon from "@mui/icons-material/SpellcheckOutlined";
import DoNotDisturbOnTotalSilenceOutlinedIcon from "@mui/icons-material/DoNotDisturbOnTotalSilenceOutlined";
import { withAlert } from "react-alert";
import io from "socket.io-client";
class QuanLyGioHang extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOrder: [],
    };
    this.socket = io(`localhost:9000/`, {
      transports: ["websocket", "polling", "flashsocket"],
    });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.allOrders !== this.props.allOrders) {
      this.setState({
        listOrder: this.props.allOrders.orderList,
      });
    }
  }
  componentDidMount() {
    this.props.getAllOrders();
    console.log(123);

    this.socket.on("BUY_PRODUCT", () => {
      setTimeout(() => {
        this.props.getAllOrders();
      }, 500);
    });
  }
  updateOrder = (id) => {
    this.props.updateOrder(id);
    this.socket.emit("CHANGE_STATUS", id);
    setTimeout(() => {
      let { message, statusCode } = this.props.message;
      let { success, error } = this.props.alert;
      this.props.getAllOrders();
      if (statusCode === 200) {
        success(message);
        return;
      }
      error(message);
    }, 600);
  };
  render() {
    const columns = [
      {
        field: "idUser",
        headerName: "Id User",
        width: 250,
      },
      {
        field: "img",
        headerName: "Product",
        width: 180,
        renderCell: (params) => <img src={params.row.image}></img>,
      },
      {
        field: "price",
        headerName: `Price `,
        width: 250,
      },

      { field: "createdAt", width: 180 },
      { field: "quantity", width: 180 },
      {
        field: "status",
        width: 180,
        renderCell: (params) => (
          <p
            onClick={() => this.updateOrder(params.row.id)}
            className={params.row.active ? `active` : `pelement`}
          >
            {params.row.active ? `Process` : `Pending`}
          </p>
        ),
        // (params.row.image ? "1" : "2")
      },
    ];

    const rows = [...this.state.listOrder.reverse()];
    const listPedding = this.state.listOrder.filter((list) => !list.active);
    const process = this.state.listOrder.filter((list) => list.active);
    let total = 0;
    process.forEach((e) => {
      total += parseFloat(e.quantity) + parseFloat(e.price);
    });
    return (
      <div className="container__order">
        <div className="orders__management">
          <div className="order order-pending">
            <span>Order Pending</span>
            <div className="order-pending-icon">
              <PendingActionsOutlinedIcon></PendingActionsOutlinedIcon>
            </div>{" "}
            <br />
            <span className="number">{listPedding.length}</span>
          </div>
          <div className="order order-cancel">
            <span>Order Cancel</span>
            <div className="order-pending-icon">
              <CancelOutlinedIcon></CancelOutlinedIcon>
            </div>
            <br />
            <span className="number">{this.props.cancelProducts.length}</span>
          </div>
          <div className="order order-process">
            <span>Order Process</span>
            <div className="order-pending-icon">
              <SpellcheckOutlinedIcon></SpellcheckOutlinedIcon>
            </div>
            <br />
            <span className="number">{process.length}</span>
          </div>
          <div className="order order-total">
            <span>Order Total</span>
            <div className="order-pending-icon">
              <DoNotDisturbOnTotalSilenceOutlinedIcon></DoNotDisturbOnTotalSilenceOutlinedIcon>
            </div>
            <br />
            <span className="number"> $ {total.toFixed(2)}</span>
          </div>
        </div>
        <div className="container__order--list">
          <DataGrid
            pageSize={9}
            rows={rows}
            columns={columns}
            checkboxSelection
          />
        </div>
      </div>
    );
  }
}
export default withAlert()(QuanLyGioHang);
