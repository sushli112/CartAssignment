export const getItemsForCart = function(event) {
  console.log("inside getItemsForCart method....");
  const url = "https://cartdbserver.herokuapp.com/cartDetails";
  const response = fetch(url)
    .then(resp => resp.json())
    .then(data => {
      console.log(`items size from Server:${data.transaction}`);
      var arr = data.transaction;
      console.log(arr[0].item_list);
      return data;
    })
    .catch(error => {
      console.log(error);
    });
  return response.then(value => value);
};
