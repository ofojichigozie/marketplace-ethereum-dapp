import React, { Component } from 'react';

class ProductList extends Component {
    
    constructor(props){
        super(props);
    }

    render() {
        return(
            <div className="mt-4 table-responsive">
                <h4>List of Product</h4>
                <table className="table table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Owner</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.props.products.map((product, key) => {
                            return (
                                <tr key={key}>
                                    <td>{ product.id.toString() }</td>
                                    <td>{ product.name.toString() }</td>
                                    <td>{ window.web3.utils.fromWei(product.price.toString(), 'Ether') }</td>
                                    <td>{ product.owner.toString() }</td>
                                    <td>
                                        {!product.purchased ?
                                            <button
                                                className="btn btn-outline-dark"
                                                onClick={event => {
                                                    const { id, price } = product;
                                                    this.props.purchaseProduct(id, price);
                                                }}
                                            >
                                                Buy
                                            </button>
                                            :
                                            <strong className="text-danger">
                                                Sold out
                                            </strong>
                                        }
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ProductList;
