import "./styles/output.css";

const App = () => {
  return (
    <div className="h-[100vh] bg-[#343da3] flex items-center justify-center">
      <div className="bg-[#5561E5] p-5 flex items-start justify-center flex-col w-6/12 rounded-lg">
        <h1 className="text-[3em] text-[#fff] font-bold">
          Hello 👋, tailwind jit!
        </h1>
        <p className="text-[#fff]">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nam omnis
          fuga eum illo dolore odit, enim exercitationem quos ipsa numquam,
          ratione eveniet magni debitis illum molestias amet velit maxime
        </p>
        <button className="p-2 mt-4 bg-[#fff] rounded-md">Button</button>
      </div>
    </div>
  );
};

export default App;