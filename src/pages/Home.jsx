import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';
//import { Categories, Sort, PizzaBlock, Skeleton, Pagination } from '../components';
import { setCategoryId, setCurrentPage, setFilters } from '../redux/slices/filterSlice';
import Categories from "../components/Categories";
import Sort from '../components/Sort';
import PizzaBlock from "../components/PizzaBlock";
import Skeleton from '../components/PizzaBlock/skeleton';
import Pagination from '../components/Pagination';
import { SearchContext } from '../App';
import { sortList } from '../components/Sort';
import { fetchPizzas } from '../redux/slices/pizzaSlice';


const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isSearch = React.useRef(false);
    const isMounted = React.useRef(false);

    const { items, status } = useSelector((state) => state.pizza);
    const { categoryId, sort, currentPage } = useSelector(state => state.filter);

    const { searchValue } = React.useContext(SearchContext);

    const onChangeCategory = (id) => {
        dispatch(setCategoryId(id));
    };
    const onChangePage = (number) => {
        dispatch(setCurrentPage(number));
    };

    const getPizzas = async () => {

        const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';
        const sortBy = sort.sortProperty.replace('-', '');
        const category = categoryId > 0 ? `category=${categoryId}` : '';
        const search = searchValue ? `&search=${searchValue}` : '';


        dispatch(
            fetchPizzas({
                sortBy,
                order,
                category,
                search,
                currentPage,
            }),
        );
        window.scrollTo(0, 0);
    };

    // Если изменили параметры и был первый рендер
    React.useEffect(() => {
        if (isMounted.current) {
            const queryString = qs.stringify({
                sortProperty: sort.sortProperty,
                categoryId,
                currentPage,
            });
            navigate(`?${queryString}`);
        }
        isMounted.current = true;
    }, [categoryId, sort.sortProperty, currentPage]);

    // Если был первый рендер, то проверяем URL-параметры и сохраняем в редуксе
    React.useEffect(() => {
        if (window.location.search) {
            const params = qs.parse(window.location.search.substring(1));

            const sort = sortList.find((obj) => obj.sortProperty === params.sortProperty);

            dispatch(
                setFilters({
                    ...params,
                    sort,
                }),
            );
            isSearch.current = true;
        }
    }, []);

    // Если был первый рендерБ то запрашиваем пиццы
    React.useEffect(() => {
        window.scrollTo(0, 0);
        if (!isSearch.current) {
            getPizzas();
        }
        isSearch.current = false;
    }, [categoryId, sort.sortProperty, searchValue, currentPage]);


    return (
        <div className="container">
            <div className="content__top">
                <Categories value={categoryId} onChangeCategory={onChangeCategory} />
                <Sort />
            </div>
            <h2 className="content__title">Все пиццы</h2>
            {status === 'error' ? (
                <div className='content__error-info'>
                    <h2>Не удалось загрузить пиццы</h2>
                    <p>
                        Попробуйте повторить попытку позже.
                    </p>
                </div>
            ) : (
                <div className="content__items">
                    {status === 'loading' ? [...new Array(6)].map((_, index) => <Skeleton key={index} />)
                        : items.map((obj) => <PizzaBlock key={obj.id} {...obj} />)}
                </div>
            )}

            <Pagination currentPage={currentPage} onChangePage={onChangePage} />
        </div>
    )
}

export default Home;
