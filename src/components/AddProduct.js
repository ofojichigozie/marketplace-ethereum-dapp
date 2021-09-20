import React, { Component } from 'react';

class AddProduct extends Component {
    
    constructor(props){
        super(props);
    }

    render() {
        return(
            <div id="content" className="mt-1">
                <h4>Add Product</h4>
                <form
                    onSubmit={event => {
                        event.preventDefault();
                        const name = this.productName.value;
                        const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether');
                        this.props.createProduct(name, price);
                    }}
                    className="form"
                >
                    <div className="form-group">
                        <input
                            type="text"
                            ref={input => { this.productName = input }}
                            className="form-control"
                            id="productName"
                            aria-describedby="productNameHelp"
                            placeholder="Product name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            ref={input => { this.productPrice = input }}
                            className="form-control"
                            id="productPrice"
                            aria-describedby="productPriceHelp"
                            placeholder="Product price"
                            required
                        />
                    </div>
                    <div className="d-flex justify-content-end">
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Add Product
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default AddProduct;
