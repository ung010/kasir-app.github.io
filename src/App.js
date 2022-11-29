import React, { Component } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import {Hasil, ListCategories, Menus, NavbarComponent} from './components';
import { API_URL } from './utils/constants'
import axios from 'axios';
import Swal from 'sweetalert2'


export default class App extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       menus: [],
       categoriYangDipilih: "Makanan",
       keranjangs: []
    }
  }

  componentDidMount() {
    axios
      .get(API_URL+"products?category.nama="+this.state.categoriYangDipilih)
      .then(res => {
        const menus = res.data;
        this.setState({ menus });
      })
      .catch(error => {
        console.log("Error gan", error);
      })
  }

  changeCategory = (value) => {
    this.setState({
      categoriYangDipilih: value,
      menus: []
    })

    axios
      .get(API_URL+"products?category.nama="+value)
      .then(res => {
        const menus = res.data;
        this.setState({ menus });
      })
      .catch(error => {
        console.log("Error gan", error);
      })

  }
  
  masukKeranjang = (value) => {

    axios
      .get(API_URL+"keranjangs?product.id="+value.id)
      .then(res => {
        if(res.data.lenght === 0) {
          const menuKeranjang = {
            jumlah: 1,
            total_harga: value.harga,
            product: value
          }
      
          axios
            .post(API_URL+"keranjangs", menuKeranjang)
            .then(res => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Yeay',
                text: 'Pesananmu Masuk Keranjang'
              })
            })
            .catch(error => {
              console.log("Error gan", error);
            })
        }else{
          const menuKeranjang = {
            jumlah: res.data[0].jumlah+1,
            total_harga: res.data[0].total_harga+value.harga,
            product: value
          }

          axios
            .put(API_URL+"keranjangs/"+res.data[0].id, menuKeranjang)
            .then(res => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Yeay',
                text: 'Pesananmu Masuk Keranjang'
              })
            })
            .catch(error => {
              console.log("Error gan", error);
            })
        }
      })
      .catch(error => {
        console.log("Error gan", error);
      })
  }
  
  render() {
    console.log(this.state.menus);
    const { menus, categoriYangDipilih } = this.state
    return (
      <div className="App">
      <NavbarComponent />
      <div className="mt-3">
        <Container fluid>
          <Row>
            <ListCategories changeCategory={this.changeCategory} categoriYangDipilih={categoriYangDipilih}/>
            <Col>
              <h4>
                <strong>Daftar Produk</strong>
              </h4>
              <hr />
              <Row>
                {menus && menus.map((menu) => (
                  <Menus 
                    keys={menu.id}
                    menu={menu}
                    masukKeranjang={this.masukKeranjang}
                  />
                ))}
              </Row>
            </Col>
            <Hasil />
          </Row>
        </Container>
      </div>
    </div>
    )
  }
}
