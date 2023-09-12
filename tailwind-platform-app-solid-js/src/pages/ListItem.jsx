import { Link } from "@solidjs/router";

const ListItem = (props) => {
  const item = props.item;

  return (
    <div class="bg-white shadow-md p-4 mb-4">
      <h2 class="text-xl font-semibold">{item.name}</h2>
      <p class="text-gray-600">Color: {item.color}</p>
      {/* Add more item attributes here */}
      <Link to={`/item/${item.id}`} class="text-blue-500 hover:underline">
        View Details
      </Link>
    </div>
  );
};

export default ListItem;
