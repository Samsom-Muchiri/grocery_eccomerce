import React, { useContext, useEffect, useRef, useState } from "react";
import "../../styles/search.css";
import { productData } from "../../fakeData";
import { CONT } from "../../AppContext/context";
import _debounce from "lodash/debounce";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { base_url } from "../../base_url";
import axios from "axios";

function Search({ closeSearch }) {
  const vl = useContext(CONT);
  const [searchResult, setSearchResult] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearch, setRecentSearch] = useState([]);
  useEffect(() => {
    const rs = localStorage.getItem("recent_search");
    if (rs) {
      setRecentSearch(JSON.parse(rs));
    }
  }, []);
  const debouncedSetSearchQuery = _debounce((value) => {
    setSearchQuery(value);
  }, 300);

  const products = useQuery(
    "products",
    async () => {
      const response = await axios.get(`${base_url}/products/`, {
        headers: {
          Authorization: `Bearer ${vl.token}`,
        },
      });
      return response.data;
    },
    {
      refetchInterval: 300000, // Refetch data every 10 seconds (in milliseconds)
      refetchIntervalInBackground: true, // Allow refetching even when the component is not visible
    }
  );

  const productSuggestion = productData.slice(0, 6);
  const popularSearch = productData.slice(5, 10);
  const searchInputRef = useRef(null);
  return (
    <div className="search-card-cnt">
      <div className="search-card">
        <section className="search-head">
          <div className="product-search">
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              placeholder="Search all our groceries"
              ref={searchInputRef}
              onInput={(e) => debouncedSetSearchQuery(e.target.value)}
            />
          </div>
          <div className="search-close" onClick={() => closeSearch(false)}>
            <span className="material-symbols-outlined">close</span>
          </div>
        </section>
        {searchQuery === "" ? (
          <div className="search-sec-cnt">
            {recentSearch.length > 0 && (
              <section>
                <h1 style={{ marginTop: "0.5rem" }}>Recent search</h1>
                <div className="recent-search">
                  {recentSearch.map((search) => {
                    return (
                      <div
                        className="rs"
                        key={search.id + search.search}
                        onClick={() => {
                          if (searchInputRef.current) {
                            searchInputRef.current.value = search.search;
                          }
                          setSearchQuery(search.search);
                        }}
                      >
                        {search.search}
                        <div
                          className="rs-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRecentSearch((prev) =>
                              prev.filter((sc) => sc.id !== search.id)
                            );
                            localStorage.setItem(
                              "recent_search",
                              JSON.stringify(recentSearch)
                            );
                          }}
                        >
                          <span className="material-symbols-outlined">
                            close
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
            <section>
              <h1>Sugggestions for you</h1>
              <div className="search-suggestions">
                {productSuggestion.map((product) => (
                  <Link
                    to={`/product/${product.name}_${product.id}`}
                    key={product.image_url + product.id}
                  >
                    <div className="prs">
                      <div className="prs-image">
                        <img src={product.image_url} alt="" />
                      </div>
                      <div className="prs-info">
                        <div className="prs-name">{product.name}</div>
                        <div className="prs-price">
                          {vl.formatCurrencyKE(product.price)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
            <section>
              <h1>Popular search</h1>
              <div className="search-suggestions">
                {popularSearch.map((product, i) => (
                  <Link
                    to={`/product/${product.name}_${product.id}`}
                    key={i + product.price}
                  >
                    <div className="prs">
                      <div className="prs-image">
                        <img src={product.image_url} alt="" />
                      </div>
                      <div className="prs-info">
                        <div className="prs-name">{product.name}</div>
                        <div className="prs-price">
                          {vl.formatCurrencyKE(product.price)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <ul className="search-results">
            {productData
              .filter((product) =>
                product.name
                  .toLocaleLowerCase()
                  .includes(searchQuery.toLocaleLowerCase())
              )
              .slice(0, 7)
              .map((result) => (
                <Link
                  to={`/product/${result.name}_${result.id}`}
                  key={result.name}
                  onClick={() => {
                    closeSearch(false);
                    const rs = localStorage.getItem("recent_search");
                    if (rs) {
                      const rsSet = JSON.parse(rs);
                      const rsIds = rsSet.map((r) => r.id);
                      if (!rsIds.includes(result.id)) {
                        localStorage.setItem(
                          "recent_search",
                          JSON.stringify([
                            { search: result.name, id: result.id },
                            ...rsSet.slice(0, 10),
                          ])
                        );
                      }
                    } else {
                      localStorage.setItem(
                        "recent_search",
                        JSON.stringify([{ search: result.name, id: result.id }])
                      );
                    }
                  }}
                >
                  <li>
                    <div className="s-r-img">
                      <img src={result.image_url} alt="" />
                    </div>
                    <div className="s-r-info">
                      <div className="r-s-name">{result.name}</div>
                      <div className="r-s-price">
                        <strike>{vl.formatCurrencyKE(result.discount)}</strike>{" "}
                        <span>{vl.formatCurrencyKE(result.price)}</span>
                      </div>
                    </div>
                  </li>
                </Link>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Search;
