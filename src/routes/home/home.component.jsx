const Home = () => {
  return (
    <div>
      <h1>Sample React Stock Portfolio</h1>
      <p>This page is a live demo of a simple Stock Portfolio app written in React.</p>
      <h2>Features</h2>
      <ul>
        <li>A reusable ItemList component that displays portfolio names and stock symbol lists</li>
        <li>A context that holds a directory of stock portfolios</li>
        <li>User authentication through Firebase and CRUD operations against a Firestore database</li>
        <li>Visitors can view a sample portfolio with live data</li>
        <li>Logged in users can create and view their own portfolios that are stored on Firebase</li>
        <li>Stock data is loaded through the browser from Yahoo Finance, using allorigins.win to get around CORS issues</li>
        <li>Responsive design for mobile devices</li>
      </ul>
    </div>
  );
};

export default Home;
