import { useState } from "react";
import {
  useAddSuperHeroData,
  useSuperHeroesData,
} from "../hooks/useSuperHeroesData";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from 'react-query'
import axios from 'axios'


export const RQSuperHeroesPage = () => {
  const [name, setName] = useState("");
  const [alterEgo, setAlterEgo] = useState("");

  const onSuccess = (data) => {
    console.log({ data });
  };

  const onError = (error) => {
    console.log({ error });
  };

  // const { isLoading, data, isError, error, refetch } = useSuperHeroesData( //react-query 사용해 data fetching방법
  //   onSuccess,
  //   onError
  // );

  // const { mutate: addHero } = useAddSuperHeroData();

  // const handleAddHeroClick = () => {
  //   const hero = { name, alterEgo };
  //   addHero(hero);
  // };

  const { isLoading, data, isError, error, refetch } = useQuery("super-heroes", () => {//key , promise반환하는 함수
    return axios.get(`http://localhost:4000/superheroes`);
  });

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  return (
    <>
      <h2>React Query Super Heroes Page</h2>
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          value={alterEgo}
          onChange={(e) => setAlterEgo(e.target.value)}
        />
        <button >Add Hero</button> 
        {/* onClick={handleAddHeroClick} */}
      </div>
      <button onClick={refetch}>Fetch heroes</button>
      {data?.data.map((hero) => {
        return (
          <div key={hero.id}>
            <Link to={`/rq-super-heroes/${hero.id}`}>
              {hero.id} {hero.name}
            </Link>
          </div>
        );
      })} 
       {/* {data.map(heroName => {
        return <div key={heroName}>{heroName}</div>
      })} */}
    </>
  );
};
