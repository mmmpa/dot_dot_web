Rails.application.routes.draw do
  get 'editor', to: 'editor#show'

  get 'user_sessions/new'

  get 'user_sessions/create'

  get 'user_sessions/destroy'

  get 'users/new'

  get 'users/create'

  get 'user/new'

  get 'user/create'

end

# == Route Map
#
# You don't have any routes defined!
#
# Please add some routes in config/routes.rb.
#
# For more information about routes, see the Rails guide: http://guides.rubyonrails.org/routing.html.
#
