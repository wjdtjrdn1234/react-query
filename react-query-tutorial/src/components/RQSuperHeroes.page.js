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

  // const onSuccess = (data) => {
  //   console.log({ data });
  // };

  // const onError = (error) => {
  //   console.log({ error });
  // };

  // const { isLoading, data, isError, error, refetch } = useSuperHeroesData( 
  //   onSuccess,
  //   onError
  // );

  // const { mutate: addHero } = useAddSuperHeroData();

  // const handleAddHeroClick = () => {
  //   const hero = { name, alterEgo };
  //   addHero(hero);
  // };

  //react-query 사용해 data fetching,loading,error 처리방법
  //단순 axios를 사용하면 접속할떄마다 데이터요청을 하지만 react-query는 값이 안바뀌면 캐싱하고 다시요청하지않음(default 5분동안 캐시 )
  //단순 axios는 db에 data값이 변경될경우 재접속해야되지만, react-query는 실시간으로 변경됨
  //stale : 서버에서 한번 프론트로 데이터를 주면 그 사이에 다른 유저가 데이터를 추가, 수정, 삭제 등등 할 수 있기 때문에 만료되었다고 한다. (최신화가 필요한 데이터)
  const { isLoading,isFetching, data, isError, error, refetch } = useQuery("super-heroes", () => {//key , promise반환하는 함수
    return axios.get(`http://localhost:4000/superheroes`);
  },
  {
    cacheTime:5000, //캐시시간 5초로 설정(default 5분동안 캐시 )
    staleTime:5000 //데이터가 fresh -> stale 상태로 변경되는데 걸리는 시간 //이 캐시 데이터의 "신선한 상태"가 언제까지 될지를 말해주는 옵션이다. 
                  // default는 0이고 , 받아오는 즉시 stale 하다고 판단하며 캐싱 데이터와 무관하게 계속해서 fetching을 수행한다
                  //즉 fresh 상태일떄는 db data가 변하든말든 request를 보내지않음
  }
  );
  console.log('isLoading:',isLoading,'isFetching:',isFetching) 

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

// React Query의 라이프 사이클

// fetching - 데이터 요청 상태
// fresh - 데이터가 프레시한(만료되지 않은) 상태.
// 컴포넌트의 상태가 변경되더라도 데이터를 다시 요청하지 않는다.
// 새로고침 하면 다시 fetching 한다.
// stale - 데이터가 만료된 상태.
// 데이터가 만료되었다는 것은 서버에서 한번 프론트로 데이터를 주면 그 사이에 다른 유저가 데이터를 추가, 수정, 삭제 등등 할 수 있기 때문에 만료되었다고 한다. (최신화가 필요한 데이터)
// 컴포넌트가 마운트, 업데이트되면 데이터를 다시 요청합니다.
// fresh에서 stale로 넘어가는 시간 -> 기본값 0
// inactive - 사용하지 않는 상태.
// 일정 시간이 지나면 가비지 콜렉터가 캐시에서 제거함
// 기본값 5분
// delete - 가비지 콜렉터에 의해 캐시에서 제거된 상태.

// React Query의 라이프 사이클
// A 쿼리 인스턴스가 mount 됨
// 네트워크에서 데이터 fetch 하고 A라는 query key로 캐싱함
// 이 데이터는 fresh 상태에서 staleTime(기본값 0) 이후 stale 상태로 변경됨
// A 쿼리 인스턴스가 unmount 됨
// 캐시는 cacheTime(기본값 5min) 만큼 유지되다가 가비지 콜렉터로 수집됨
// 만일 cacheTime이 지나기 전에 A 쿼리 인스턴스가 새롭게 mount되면, fetch가 실행되고 fresh한 값을 가져오는 동안 캐시 데이터를 보여줌
// staleTime
// 데이터가 fresh -> stale 상태로 변경되는데 걸리는 시간
// fresh 상태일때는 쿼리 인스턴스가 새롭게 mount 되어도 네트워크 fetch가 일어나지 않는다.
// 데이터가 한번 fetch 되고 나서 staleTime이 지나지 않았다면 unmount 후 mount 되어도 fetch가 일어나지 않는다.
// cacheTime
// 데이터가 inactive 상태일 때 캐싱된 상태로 남아있는 시간
// 쿼리 인스턴스가 unmount 되면 데이터는 inactive 상태로 변경되며, 캐시는 cacheTime만큼 유지된다.
// cacheTime이 지나면 가비지 콜렉터로 수집된다.
// cacheTime이 지나기 전에 쿼리 인스턴스가 다시 마운트 되면, 데이터를 fetch하는 동안 캐시 데이터를 보여준다.
// cacheTime은 staleTime과 관계없이, 무조건 inactive 된 시점을 기준으로 캐시 데이터 삭제를 결정한다.
// 그 외
// isFetching : 데이터가 fetch될 때 true, 캐싱 데이터가 있어서 백그라운드에서 fetch되더라도 true
// isLoading : 캐싱된 데이터가 없을때 fetch 중에 true