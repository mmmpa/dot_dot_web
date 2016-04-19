class UserSessionsController < ApplicationController
  def new
  end

  def create
    UserSession.create!(session_params)
  end

  def destroy
    UserSession.find.try(:user).destroy!
  end

  private
  def session_params
    params.require(:account_session).permit(:login, :password)
  end
end
